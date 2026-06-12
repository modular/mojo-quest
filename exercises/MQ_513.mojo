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
# Mojo concept: Implement `__getitem__()` to support subscript reads (`obj[i]`)
struct Frame(Copyable, Movable):
    var a: Int
    var b: Int
    var c: Int

    def __init__(out self, a: Int, b: Int, c: Int):
        self.a = a
        self.b = b
        self.c = c

    def __getitem__(self, i: Int) -> Int:
        if i == 0:
            return self.a
        if i == 1:
            return self.b
        return self.c


def main():
    var f = Frame(10, 20, 30)
    print("channel 1:", f[1])
