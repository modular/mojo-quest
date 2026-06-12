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
# Mojo concept: Mojo evaluates `a + b` by calling `a.__add__(b)`
struct EnergyBudget(Copyable, Movable):
    var millijoules: Int

    def __init__(out self, millijoules: Int):
        self.millijoules = millijoules

    def __add__(self, other: Self) -> Self:
        return Self(self.millijoules + other.millijoules)


def main():
    var drive_budget = EnergyBudget(100)
    var sense_budget = EnergyBudget(56)
    var total = drive_budget + sense_budget
    print("combined budget:", total.millijoules)
