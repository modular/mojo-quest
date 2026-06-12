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
# Mojo concept: Keyword arguments are specified using `argument_name = argument_value` and can be passed in any order
def set_limits(max_speed: Int, max_accel: Int):
    print("speed:", max_speed, "accel:", max_accel)


def main():
    set_limits(max_speed=2, max_accel=5)
