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
# Mojo concept: The `@fieldwise_init` decorator generates a field-wise constructor, so you don't have to write `__init__` by hand
@fieldwise_init
struct LidarScan(Copyable, Movable):
    var near_points: Int
    var far_points: Int

    def total(self) -> Int:
        return self.near_points + self.far_points


def main():
    var scan = LidarScan(8, 256)
    print("Total points:", scan.total())
