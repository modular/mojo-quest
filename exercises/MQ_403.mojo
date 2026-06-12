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
# Mojo concept: To re-raise a caught error, use `raise` with the `^` sigil to transfer ownership of the error value
def attempt() raises:
    try:
        raise Error("sensor fault")
    except e:
        print("logging:", e)
        raise e^


def main():
    try:
        attempt()
    except:
        print("recovered")
