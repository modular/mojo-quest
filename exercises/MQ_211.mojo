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
# Mojo concept: Convert the operands to the target type's constructor before dividing to avoid integer truncation
def avg_latency(total_ms: Int, num_loops: Int) -> Float64:
    return Float64(total_ms) / Float64(num_loops)


def main():
    print("avg latency:", avg_latency(7, 2))
