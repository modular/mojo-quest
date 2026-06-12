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
# Mojo concept: Bitwise OR (`|`) keeps bits that are set in either operand
def status_word(ready: Int, armed: Int) -> Int:
    return ready | armed


def main():
    var READY = 1
    var ARMED = 2
    var flags = status_word(READY, ARMED)
    print("armed:", (flags & ARMED) != 0)
