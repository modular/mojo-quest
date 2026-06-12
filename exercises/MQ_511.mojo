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
# Mojo concept: A unary operator like `-x` calls `__neg__()`, returning a new value representing the result
struct Offset(Copyable, Movable):
    var v: Int

    def __init__(out self, v: Int):
        self.v = v

    def __neg__(self) -> Self:
        return Self(-self.v)


def main():
    var o = Offset(5)
    var n = -o
    print("neg:", n.v)
