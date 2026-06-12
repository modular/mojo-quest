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
# Mojo concept: `assert_raises` from the `testing` module is a context manager that asserts its `with` block raises an error
from std.testing import assert_raises


def clamp(n: Int) raises -> Int:
    if n < 0:
        raise Error("negative speed")
    return n


def main() raises:
    with assert_raises():
        _ = clamp(-1)
    print("raised as expected")
