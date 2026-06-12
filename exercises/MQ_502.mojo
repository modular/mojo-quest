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
# Mojo concept: Methods that take the implicit `self` argument are instance methods that act on an instance of the struct
struct Battery:
    var charge: Int

    def __init__(out self, charge: Int):
        self.charge = charge

    def is_low(self) -> Bool:
        return self.charge < 20


def main():
    var b = Battery(15)
    print("low:", b.is_low())
