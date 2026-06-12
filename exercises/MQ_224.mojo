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
# Mojo concept: An `Optional` represents a value that may or may not be present
from std.collections import Optional


def cache_lookup(sensor_id: Int) -> Optional[Int]:
    if sensor_id == 7:
        return Optional(512)
    return None


def main() raises:
    var hit = cache_lookup(7)
    var miss = cache_lookup(3)
    if hit:
        print("hit:", hit.value())
    else:
        print("hit:", hit)
    if miss:
        print("miss:", miss.value())
    else:
        print("miss:", miss)
