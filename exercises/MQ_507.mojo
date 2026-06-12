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
# Mojo concept: A move-only type is `Movable` but not `Copyable`; transfer it with the `^` sigil
struct FileHandle(Movable):
    var fd: Int

    def __init__(out self, fd: Int):
        self.fd = fd


def take(var h: FileHandle) -> Int:
    return h.fd


def main():
    var h = FileHandle(3)
    print("fd:", take(h^))
