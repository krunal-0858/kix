#!/usr/bin/env node
/**
 * Frees KIX ports before start (runs via npm "pre" hooks).
 * Usage: node scripts/free-ports.mjs [port1,port2,...]
 */
import { execSync } from 'node:child_process';

const isWindows = process.platform === 'win32';
const argPorts = (process.argv[2] || '').trim();
const ports = (argPorts || '5180')
  .split(',')
  .map((p) => parseInt(p.trim(), 10))
  .filter((p) => Number.isInteger(p) && p > 0 && p < 65536);

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return '';
  }
}

function pidsOnPort(port) {
  const pids = new Set();
  if (isWindows) {
    // netstat can omit IPv6 listeners on some Windows builds, so query the
    // OS TCP table directly first.
    const ps = run(
      `powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique) -join ','"`
    );
    for (const pid of ps.split(/[,\s]+/)) {
      if (/^\d+$/.test(pid.trim())) pids.add(Number(pid.trim()));
    }
    if (pids.size) return [...pids];
    const out = run('netstat -ano -p tcp');
    for (const line of out.split(/\r?\n/)) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 5) continue;
      const [proto, local, , state, pid] = parts;
      if (!/^TCP$/i.test(proto)) continue;
      if (!/^LISTENING$/i.test(state)) continue;
      if (!local.endsWith(`:${port}`)) continue;
      if (/^\d+$/.test(pid)) pids.add(Number(pid));
    }
  } else {
    const out = run(`lsof -nP -iTCP:${port} -sTCP:LISTEN -t`);
    for (const pid of out.split(/\s+/)) {
      if (/^\d+$/.test(pid.trim())) pids.add(Number(pid.trim()));
    }
  }
  return [...pids];
}

function processName(pid) {
  if (isWindows) {
    const out = run(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`);
    return out.split(',')[0]?.replace(/"/g, '').trim() || 'unknown';
  }
  return run(`ps -p ${pid} -o comm=`).trim() || 'unknown';
}

function killPid(pid) {
  run(isWindows ? `taskkill /PID ${pid} /F` : `kill -9 ${pid}`);
}

for (const port of ports) {
  const pids = pidsOnPort(port);
  if (pids.length === 0) {
    console.log(`[free-ports] Port ${port} is free.`);
    continue;
  }
  for (const pid of pids) {
    if (pid === process.pid) continue;
    const name = processName(pid);
    if (/^(node|node\.exe|vite|concurrently)(\.exe)?$/i.test(name)) {
      killPid(pid);
      console.log(`[free-ports] Stopped stale process on port ${port} (PID ${pid}, ${name}).`);
    } else {
      console.warn(`[free-ports] Port ${port} used by '${name}' (PID ${pid}) - not touched.`);
    }
  }
}
