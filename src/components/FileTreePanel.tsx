import { useMemo } from 'react'
import type { GameState } from '../state/gameState'
import { issues } from '../data/issues'

type TreeNode = {
  name: string
  path: string // full path for files; dir path for folders
  children?: TreeNode[]
  issueId?: string
}

function buildTree(files: { path: string; issueId: string }[]): TreeNode[] {
  const root: TreeNode[] = []
  for (const { path: full, issueId } of files) {
    const parts = full.split('/')
    let level = root
    let acc = ''
    parts.forEach((part, i) => {
      acc = acc ? `${acc}/${part}` : part
      const isFile = i === parts.length - 1
      let node = level.find((n) => n.name === part)
      if (!node) {
        node = {
          name: part,
          path: acc,
          children: isFile ? undefined : [],
          issueId: isFile ? issueId : undefined,
        }
        level.push(node)
      }
      if (!isFile) level = node.children!
    })
  }
  return root
}

function fileIcon(name: string): string {
  if (name.endsWith('.mojo')) return '🔥'
  return '📄'
}

/** All issue ids under a node, in tree (curriculum) order. */
function collectIssueIds(node: TreeNode): string[] {
  if (node.issueId) return [node.issueId]
  if (!node.children) return []
  return node.children.flatMap(collectIssueIds)
}

/**
 * High-level curriculum sections, keyed by the leading digit of the ticket id
 * (MQ-1xx, MQ-2xx, …). These become the folders shown in the explorer, slugged
 * into directory-style names (lowercase, dash-separated).
 */
const SECTIONS: Record<string, string> = {
  '1': 'Basics & functions',
  '2': 'Vars, types & collections',
  '3': 'Operators & control flow',
  '4': 'Errors & context managers',
  '5': 'Structs & modules',
  '6': 'Value ownership',
  '7': 'Value lifecycle',
  '8': 'Metaprogramming',
  '9': 'Unsafe pointers & testing',
}

/** Slug a concept label into a directory-style name, e.g. "Value ownership" → "value-ownership". */
function sectionFolder(concept: string): string {
  return concept
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Group each issue's file under its curriculum section (preserving curriculum order). */
function sectionPath(id: string, file: string): string {
  const chapter = id.match(/MQ-(\d)/)?.[1] ?? '0'
  const section = sectionFolder(SECTIONS[chapter] ?? `mq-${chapter}xx`)
  const basename = file.split('/').pop() ?? file
  return `${section}/${basename}`
}

type Props = { game: GameState }

export function FileTreePanel({ game }: Props) {
  const tree = useMemo(
    () =>
      buildTree(
        issues.map((i) => ({ path: sectionPath(i.id, i.file), issueId: i.id })),
      ),
    [],
  )
  const activeId = game.selectedIssue?.id ?? null

  // The "current" directory is the one holding the selected issue; it's the
  // only one left expanded. If nothing is selected (or the selection isn't in
  // the tree), fall back to expanding the first folder so the view is never
  // fully collapsed.
  const anyContainsActive =
    activeId != null && tree.some((n) => collectIssueIds(n).includes(activeId))
  const fallbackPath = anyContainsActive ? null : (tree.find((n) => !!n.children)?.path ?? null)

  const renderNodes = (nodes: TreeNode[], depth: number) =>
    nodes.map((node) => {
      const isFolder = !!node.children
      const indent = { paddingLeft: `${8 + depth * 14}px` }
      if (isFolder) {
        const childIds = collectIssueIds(node)
        const expanded =
          (activeId != null && childIds.includes(activeId)) || node.path === fallbackPath
        const doneCount = childIds.filter((id) => game.completedIds.has(id)).length
        return (
          <div key={node.path}>
            <button
              className={`tree-row tree-row--folder${expanded ? ' is-expanded' : ''}`}
              style={indent}
              // Clicking a collapsed folder opens it by selecting its first
              // issue, which makes it the current directory and collapses the
              // rest. The already-current folder stays put.
              onClick={() => {
                if (!expanded && childIds[0]) game.selectIssue(childIds[0])
              }}
            >
              <span className="tree-chevron">{expanded ? '▾' : '▸'}</span>
              <span className="tree-icon">{expanded ? '📂' : '📁'}</span>
              <span className="tree-name">{node.name}</span>
              <span className="tree-count">
                {doneCount}/{childIds.length}
              </span>
            </button>
            {expanded && renderNodes(node.children!, depth + 1)}
          </div>
        )
      }
      const isOpen = !!node.issueId && node.issueId === activeId
      const isDone = node.issueId ? game.completedIds.has(node.issueId) : false
      return (
        <button
          key={node.path}
          className={`tree-row tree-row--file${isOpen ? ' is-open' : ''}`}
          style={indent}
          onClick={() => node.issueId && game.selectIssue(node.issueId)}
        >
          <span className="tree-icon">{fileIcon(node.name)}</span>
          <span className="tree-name">{node.name}</span>
          {isDone && <span className="tree-done">✓</span>}
        </button>
      )
    })

  return (
    <section className="panel filetree-panel">
      <header className="panel-header">Explorer</header>
      <div className="tree">{renderNodes(tree, 0)}</div>
    </section>
  )
}
