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
# Mojo concept: A parameterized struct adds compile-time parameters in `[]` after its name (e.g. `Buffer[size: Int]`)
struct Buffer[size: Int](Copyable, Movable):
    def __init__(out self):
        pass

    def capacity(self) -> Int:
        return Self.size


def main():
    var b = Buffer[8]()
    print("capacity:", b.capacity())
