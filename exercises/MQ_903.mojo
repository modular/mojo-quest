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
# Mojo concept: With space for multiple values, `ptr[unsafe_offset=i]` accesses the element at offset `i`
def main():
    var ptr = alloc[Int]({count = 2}).unsafe_leak()
    ptr[unsafe_offset=0] = 10
    ptr[unsafe_offset=1] = 20
    print("second:", ptr[unsafe_offset=1])
    ptr.unsafe_free()
