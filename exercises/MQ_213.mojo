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
# Mojo concept: A `SIMD` value is a fixed-size vector defined by two parameters: a `DType` and the number of elements
comptime Velocity = SIMD[DType.float32, 4]


def main():
    var v = Velocity(1.0, 2.0, 3.0, 4.0)
    print("Velocity lane 0:", v[0])
