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
# Mojo concept: All collection types in the `collections` module support `for` loop iteration over each element
def total_points(batch: List[Int]) -> Int:
    var total = 0
    for count in batch:
        total += count
    return total


def main():
    var batch: List[Int] = [12, 8, 20, 5]
    print("total points:", total_points(batch))
