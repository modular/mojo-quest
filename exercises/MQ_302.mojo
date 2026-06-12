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
# Mojo concept: Use `//` for floor division; the modulo operator `%` returns the remainder
def split_into_bins(total: Int, per_bin: Int) -> Tuple[Int, Int]:
    return total // per_bin, total % per_bin


def main():
    var result = split_into_bins(17, 5)
    print("bins:", result[0], "left:", result[1])
