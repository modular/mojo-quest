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
# Mojo concept: The `if` statement executes an indented block when its boolean expression evaluates to `True`
def route_task(queue_depth: Int) -> String:
    if queue_depth > 100:
        return "overflow-core"
    else:
        return "fast-core"


def main():
    print(route_task(250))
    print(route_task(40))
