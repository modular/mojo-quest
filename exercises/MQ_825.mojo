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
# Mojo concept: Declare trait conformance in parentheses after the struct name; the compiler enforces the trait's requirements
trait Sensor:
    def read(self) -> String:
        ...


struct Lidar(Sensor):
    var name: String

    def __init__(out self, name: String):
        self.name = name

    def read(self) -> String:
        return "Reading from " + self.name


def announce[T: Sensor](sensor: T):
    print(sensor.read())


def main():
    announce(Lidar("lidar-front"))
