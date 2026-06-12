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
# Mojo concept: A `with` statement context manager releases its resource at the end of the block, even if an error occurs
def main() raises:
    # MQ Robotics stores the active calibration profile on disk.
    with open("calib.txt", "w") as f:
        f.write("max_speed=1.5")

    with open("calib.txt", "r") as f:
        print(f.read())
