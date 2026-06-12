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
# Mojo concept: Define a copy constructor with `def __init__(out self, *, copy: Self)` to control how a value is copied
struct ScanBuffer(Copyable):
    var samples: List[Int]

    def __init__(out self, var samples: List[Int]):
        self.samples = samples^

    def __init__(out self, *, copy: Self):
        self.samples = copy.samples.copy()

    def push(mut self, t: Int):
        self.samples.append(t)

    def size(self) -> Int:
        return len(self.samples)


def main():
    var original: List[Int] = [1, 2, 3]
    var snapshot = ScanBuffer(original^)
    var working = snapshot.copy()
    working.push(99)
    print("snapshot size:", snapshot.size())
    print("working size:", working.size())
