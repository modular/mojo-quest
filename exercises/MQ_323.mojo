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
# Mojo concept: Use `elif` to add another condition to an `if`, checked only when the earlier branches were false
def power_mode(level: Int) -> String:
    if level >= 80:
        return "boost"
    elif level >= 30:
        return "cruise"
    else:
        return "sleep"


def main():
    print(power_mode(95))
    print(power_mode(50))
    print(power_mode(10))
