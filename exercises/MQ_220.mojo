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
# Mojo concept: A `Tuple` is an ordered collection; unpack it or index it to get individual values
def scan_stats() -> Tuple[Int, Int]:
    var num_scans = 4
    var total_points = 512
    return (num_scans, total_points)


def main():
    var stats = scan_stats()
    var scans = stats[0]
    var points = stats[1]
    print("scans:", scans)
    print("points:", points)
