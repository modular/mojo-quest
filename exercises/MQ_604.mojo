# ===----------------------------------------------------------------------=== #
# Copyright (c) 2026, Modular Inc. All rights reserved.
#
# Licensed under the Apache License v2.0 with LLVM Exceptions:
# https://llvm.org/LICENSE.txt
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ===----------------------------------------------------------------------=== #
# Mojo concept: A `ref` return value must name an origin; it returns a reference to an existing value, not a copy
struct CommandQueue(Copyable, Movable):
    var depth: Int

    def __init__(out self, depth: Int):
        self.depth = depth

    def borrow_depth(ref self) -> ref[self.depth] Int:
        return self.depth


def main():
    var q = CommandQueue(4)
    ref d = q.borrow_depth()
    d = 10
    print("queue depth:", q.depth)
