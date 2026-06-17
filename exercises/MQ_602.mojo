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
# Mojo concept: The `^` transfer sigil ends a variable's lifetime and transfers ownership into a `var` argument
def load_map(var cells: List[Int]) -> Int:
    return len(cells)


def main():
    var cells = [16, 32, 64, 128]
    var result = load_map(cells^)
    print("map cells loaded:", result)
