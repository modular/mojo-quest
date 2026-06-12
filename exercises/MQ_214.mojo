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
# Mojo concept: Math operations on SIMD values are applied elementwise, on each individual element in the vector
def combine_counts(
    a: SIMD[DType.int32, 4], b: SIMD[DType.int32, 4]
) -> SIMD[DType.int32, 4]:
    return a + b


def main():
    var imu_a = SIMD[DType.int32, 4](1, 2, 3, 4)
    var imu_b = SIMD[DType.int32, 4](10, 20, 30, 40)
    print("Combined counts:", combine_counts(imu_a, imu_b))
