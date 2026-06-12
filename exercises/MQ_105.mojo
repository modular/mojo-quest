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
# Mojo concept: Values are passed back using the `return` keyword; the return type is declared with the `-> type` syntax
# Ring-buffer helpers for the sensor ingest loop


def grow_capacity(n: Int) -> Int:
    return n * 2


def main():
    print("New capacity:", grow_capacity(21))
