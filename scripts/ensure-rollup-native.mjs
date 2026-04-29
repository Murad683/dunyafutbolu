import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

function isMusl() {
  if (process.platform !== "linux") return false;

  const report = process.report?.getReport?.();
  return !report?.header?.glibcVersionRuntime;
}

function getRollupNativePackage() {
  const target = `${process.platform}/${process.arch}`;

  switch (target) {
    case "win32/x64":
      return "@rollup/rollup-win32-x64-msvc";
    case "win32/arm64":
      return "@rollup/rollup-win32-arm64-msvc";
    case "darwin/x64":
      return "@rollup/rollup-darwin-x64";
    case "darwin/arm64":
      return "@rollup/rollup-darwin-arm64";
    case "linux/x64":
      return isMusl() ? "@rollup/rollup-linux-x64-musl" : "@rollup/rollup-linux-x64-gnu";
    case "linux/arm64":
      return isMusl() ? "@rollup/rollup-linux-arm64-musl" : "@rollup/rollup-linux-arm64-gnu";
    case "linux/arm":
      return "@rollup/rollup-linux-arm-gnueabihf";
    case "freebsd/x64":
      return "@rollup/rollup-freebsd-x64";
    case "android/arm64":
      return "@rollup/rollup-android-arm64";
    default:
      return null;
  }
}

function getEsbuildNativePackage() {
  const target = `${process.platform}/${process.arch}`;

  switch (target) {
    case "win32/x64":
      return "@esbuild/win32-x64";
    case "win32/arm64":
      return "@esbuild/win32-arm64";
    case "win32/ia32":
      return "@esbuild/win32-ia32";
    case "darwin/x64":
      return "@esbuild/darwin-x64";
    case "darwin/arm64":
      return "@esbuild/darwin-arm64";
    case "linux/x64":
      return "@esbuild/linux-x64";
    case "linux/arm64":
      return "@esbuild/linux-arm64";
    case "linux/arm":
      return "@esbuild/linux-arm";
    case "linux/ia32":
      return "@esbuild/linux-ia32";
    case "freebsd/arm64":
      return "@esbuild/freebsd-arm64";
    case "freebsd/x64":
      return "@esbuild/freebsd-x64";
    case "netbsd/arm64":
      return "@esbuild/netbsd-arm64";
    case "netbsd/x64":
      return "@esbuild/netbsd-x64";
    case "openbsd/arm64":
      return "@esbuild/openbsd-arm64";
    case "openbsd/x64":
      return "@esbuild/openbsd-x64";
    case "android/arm":
      return "@esbuild/android-arm";
    case "android/arm64":
      return "@esbuild/android-arm64";
    case "android/x64":
      return "@esbuild/android-x64";
    case "sunos/x64":
      return "@esbuild/sunos-x64";
    default:
      return null;
  }
}

function getTailwindOxideNativePackage() {
  const target = `${process.platform}/${process.arch}`;

  switch (target) {
    case "win32/x64":
      return "@tailwindcss/oxide-win32-x64-msvc";
    case "win32/arm64":
      return "@tailwindcss/oxide-win32-arm64-msvc";
    case "darwin/x64":
      return "@tailwindcss/oxide-darwin-x64";
    case "darwin/arm64":
      return "@tailwindcss/oxide-darwin-arm64";
    case "linux/x64":
      return isMusl() ? "@tailwindcss/oxide-linux-x64-musl" : "@tailwindcss/oxide-linux-x64-gnu";
    case "linux/arm64":
      return isMusl() ? "@tailwindcss/oxide-linux-arm64-musl" : "@tailwindcss/oxide-linux-arm64-gnu";
    case "linux/arm":
      return "@tailwindcss/oxide-linux-arm-gnueabihf";
    case "freebsd/x64":
      return "@tailwindcss/oxide-freebsd-x64";
    case "android/arm64":
      return "@tailwindcss/oxide-android-arm64";
    default:
      return null;
  }
}

function resolveFromRoot(specifier) {
  return require.resolve(specifier, { paths: [projectRoot] });
}

function getPackageVersion(pkgName) {
  const pkgJsonPath = resolveFromRoot(`${pkgName}/package.json`);
  return require(pkgJsonPath).version;
}

function installPackages(packages) {
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(
    npmCmd,
    [
      "install",
      "--no-save",
      "--no-package-lock",
      ...packages.map(({ name, version }) => `${name}@${version}`),
    ],
    {
      cwd: projectRoot,
      stdio: "inherit",
      env: process.env,
      shell: process.platform === "win32",
    },
  );

  if (result.error) {
    console.error(`[ensure-rollup-native] Failed to launch ${npmCmd}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const packagesToCheck = [
  {
    basePackage: "rollup",
    nativePackage: getRollupNativePackage(),
  },
  {
    basePackage: "esbuild",
    nativePackage: getEsbuildNativePackage(),
  },
  {
    basePackage: "@tailwindcss/oxide",
    nativePackage: getTailwindOxideNativePackage(),
  },
];

const missingPackages = [];

for (const { basePackage, nativePackage } of packagesToCheck) {
  if (!nativePackage) {
    console.warn(
      `[ensure-rollup-native] No native package mapping for ${basePackage} on ${process.platform}/${process.arch}; skipping check.`,
    );
    continue;
  }

  let version;

  try {
    version = getPackageVersion(basePackage);
  } catch {
    continue;
  }

  const nativePkgPath = path.join(projectRoot, "node_modules", ...nativePackage.split("/"));

  if (!existsSync(nativePkgPath)) {
    missingPackages.push({ name: nativePackage, version });
  }
}

if (missingPackages.length === 0) {
  process.exit(0);
}

console.log(
  `[ensure-rollup-native] Installing missing native packages: ${missingPackages.map(({ name }) => name).join(", ")}`,
);
installPackages(missingPackages);

for (const { name } of missingPackages) {
  const nativePkgPath = path.join(projectRoot, "node_modules", ...name.split("/"));

  if (!existsSync(nativePkgPath)) {
    console.error(`[ensure-rollup-native] ${name} is still missing after install.`);
    process.exit(1);
  }
}
