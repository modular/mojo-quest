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
# Mojo concept: Implement `__eq__()` to support `==`; the `Equatable` trait provides `__eq__()` and `__ne__()`
struct Version(Copyable, Movable):
    var major: Int

    def __init__(out self, major: Int):
        self.major = major

    def __eq__(self, other: Self) -> Bool:
        return self.major == other.major


def main():
    var a = Version(2)
    var b = Version(2)
    print("equal:", a == b)
