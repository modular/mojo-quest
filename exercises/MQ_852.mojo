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
# Mojo concept: The `comptime` keyword forces an expression to be evaluated at compile time
comptime dim = 8


def transform_size[dim: Int]() -> Int:
    # a dim x dim transform matrix has dim * dim entries
    return dim * dim


def main():
    print("matrix entries:", transform_size[dim]())
