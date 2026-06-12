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
# Mojo concept: An `@implicit` single-argument constructor enables implicit conversion from the source type
struct Celsius(Copyable, Movable):
    var deg: Int

    @implicit
    def __init__(out self, deg: Int):
        self.deg = deg


def report(t: Celsius):
    print("temp:", t.deg)


def main():
    report(25)
