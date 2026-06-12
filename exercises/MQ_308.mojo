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
# Mojo concept: The `in` operator checks whether a collection contains a value
def is_allowed(sensor_id: Int, allowed: List[Int]) -> Bool:
    return sensor_id in allowed


def main():
    var allowed = [2, 4, 6]
    print("ok:", is_allowed(4, allowed))
