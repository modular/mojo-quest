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
# Mojo concept: To let a method mutate the instance, declare its receiver as `mut self`
struct FrameCounter(Copyable, Movable):
    var count: Int

    def __init__(out self, count: Int):
        self.count = count

    def increment(mut self):
        self.count += 1

    def get(self) -> Int:
        return self.count


def main():
    var counter = FrameCounter(0)
    counter.increment()
    counter.increment()
    print("Frames handled:", counter.get())
