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
# Mojo concept: Use `reflect[T]` to inspect a type at compile time, querying members like `field_count()`
struct RobotConfig(Copyable, Movable):
    var max_speed: Int
    var wheel_radius: Int
    var num_sensors: Int

    def __init__(out self, max_speed: Int, wheel_radius: Int, num_sensors: Int):
        self.max_speed = max_speed
        self.wheel_radius = wheel_radius
        self.num_sensors = num_sensors


def main():
    comptime field_count = reflect[RobotConfig].field_count()
    print("RobotConfig fields:", field_count)
