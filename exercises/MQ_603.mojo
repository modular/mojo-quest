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
# Mojo concept: A `mut` argument is a mutable reference: changes inside the function are visible outside it
struct Pose(Copyable, Movable):
    var x: Int

    def __init__(out self, x: Int):
        self.x = x


def shift(mut p: Pose, dx: Int):
    p.x += dx


def main():
    var pose = Pose(10)
    shift(pose, 5)
    print("x:", pose.x)
