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
# Mojo concept: `if case .Some(name) = value:` tests an `Optional` for a value and binds it in one step
def describe(reading: Optional[Int]) -> String:
    if case .Some(level) = reading:
        return "charge: " + String(level) + "%"
    return "no reading"


def main():
    print(describe(87))
    print(describe(None))
