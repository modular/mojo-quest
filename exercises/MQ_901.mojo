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
# Mojo concept: Use the free function `unsafe_alloc[T](n)` to allocate space for `n` uninitialized values of `T`
from std.memory.alloc import unsafe_alloc


def main():
    # Stage a single encoder reading in a scratch buffer.
    var ptr = unsafe_alloc[Int](1)
    ptr.unsafe_write(copy=99)
    var value = ptr[]
    print("Encoder count:", value)
    ptr.unsafe_deinit_pointee()
    ptr.unsafe_free()
