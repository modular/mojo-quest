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
# Mojo concept: `assert_equal` from the `testing` module asserts that two values are equal
from std.testing import assert_equal


def total_distance(near: Int, far: Int) -> Int:
    return near + far


def main() raises:
    assert_equal(total_distance(100, 50), 150)
    print("All checks passed!")
