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
# Mojo concept: `Dict` holds key-value pairs; specify the key type and value type as parameters
from std.collections import Dict


def main() raises:
    var joint_angles = Dict[String, Int]()
    joint_angles["joint_3"] = 128
    joint_angles["joint_8"] = 256
    print("joint angle:", joint_angles["joint_3"])
    print("joints:", len(joint_angles))
