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
# Mojo concept: Write `not Movable` in a struct's conformance list to opt out of `Movable`, making the type immovable
struct PortLock(not Movable):
    var port: Int

    def __init__(out self, port: Int):
        self.port = port


def main():
    var lock = PortLock(4)
    print("locked port:", lock.port)
