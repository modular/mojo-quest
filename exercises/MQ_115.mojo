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
# Mojo concept: Functions are non-raising by default; add the `raises` keyword to propagate an error to the caller
def read_sensor(id: Int) raises -> Int:
    if id < 0:
        raise Error("bad sensor id")
    return id * 10


def main() raises:
    print("reading:", read_sensor(2))
