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
# Mojo concept: Constrain a generic parameter with a trait (e.g. `[T: Writable]`) to bound the types it accepts
# Logs any value the telemetry bus touches, whatever its type.
def log_value[T: Writable](value: T):
    print("telemetry:", value)


def main():
    log_value(42)
    log_value("ready")
