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
# Mojo concept: A `match` statement runs the first `case` whose pattern matches, so the `_` catch-all goes last
def mode_name(code: Int) -> String:
    match code:
        case 0:
            return "idle"
        case 1 | 2:
            return "driving"
        case 3:
            return "docking"
        case _:
            return "unknown"


def main():
    for code in [0, 2, 3, 7]:
        print(code, "->", mode_name(code))
