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
# Mojo concept: `comptime assert cond, "msg"` asserts a condition at compile time; if false, compilation fails
def make_drive[num_motors: Int]() -> Int:
    # The drive train must pair motors across an even motor count.
    comptime assert num_motors % 2 == 0, "num_motors must be even"
    return num_motors * 64


def main():
    print("Drive slots:", make_drive[8]())
