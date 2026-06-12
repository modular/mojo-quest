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
# Mojo concept: The `Sized` trait requires a type to implement `__len__()`, which the built-in `len()` function uses
struct Track(Sized):
    var n: Int

    def __init__(out self, n: Int):
        self.n = n

    def __len__(self) -> Int:
        return self.n


def main():
    var t = Track(5)
    print("len:", len(t))
