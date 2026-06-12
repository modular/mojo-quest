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
# Mojo concept: Like any method, `__init__()` can be overloaded to construct the object from different arguments
struct RobotConfig(Copyable, Movable):
    var name: String
    var max_rate: Int

    def __init__(out self, name: String, max_rate: Int):
        self.name = name
        self.max_rate = max_rate

    # Re-badge an existing config under a new name, keeping its rate. This takes
    # a different second-argument type than the constructor above, so it must be
    # a separate overload — a default argument couldn't express both forms.
    def __init__(out self, name: String, template: Self):
        self.name = name
        self.max_rate = template.max_rate


def main():
    var base = RobotConfig("base", 512)
    var arm = RobotConfig("arm", base)
    print("Robot:", arm.name, "max_rate:", arm.max_rate)
