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
# Mojo concept: A type can't store another instance of itself; use a pointer, which has a fixed size, instead
from std.memory import UnsafePointer


# A pose-graph node that links back to the previous pose in the trajectory.
# `prev` is a fixed-size pointer to another `PoseNode`, not a `PoseNode` field
# (which would make the struct infinitely large). `UnsafePointer` takes an
# `origin` parameter naming the memory the pointer may access; `StaticConstantOrigin`
# is the simplest stand-in here, since a freshly built node has no previous pose.
struct PoseNode(Copyable, Movable):
    var pose_id: Int
    var prev: UnsafePointer[Self, StaticConstantOrigin]

    def __init__(out self, pose_id: Int):
        self.pose_id = pose_id
        # A null pointer is the sentinel for "no previous pose yet".
        self.prev = UnsafePointer[Self, StaticConstantOrigin]()


def main():
    var node = PoseNode(128)
    print("pose node:", node.pose_id)
