#!/usr/bin/env bash
# ==============================================================================
# Deploy Script for Synthetic Performance USA (syntheticperformanceusa.com)
# ==============================================================================
# Takes a fresh cloned repository through prerequisites, dependency installation,
# typecheck, Astro static build, and Cloudflare Workers Custom Domain deployment.
#
# Usage:
#   ./deploy.sh [OPTIONS]
#
# Options:
#   --dry-run       Validate prerequisites, install, check, and build without deploying
#   --skip-check    Skip Astro TypeScript typechecking (pnpm run check)
#   --skip-build    Skip Astro build step if dist/ is already pre-built
#   --help, -h      Display this help menu
#
# Environment Variables:
#   CLOUDFLARE_API_TOKEN    (Optional) Cloudflare API Token for headless/CI deployments
#   CLOUDFLARE_ACCOUNT_ID   (Optional) Target Cloudflare Account ID
# ==============================================================================

set -euo pipefail

# Text styling
BOLD="\033[1m"
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
CYAN="\033[36m"
DIM="\033[2m"
RESET="\033[0m"

log_info() {
  echo -e "${BLUE}ℹ${RESET} $1"
}

log_success() {
  echo -e "${GREEN}✓${RESET} $1"
}

log_warn() {
  echo -e "${YELLOW}▲${RESET} $1"
}

log_error() {
  echo -e "${RED}✖${RESET} $1" >&2
}

log_step() {
  echo -e "\n${BOLD}${CYAN}==>${RESET} ${BOLD}$1${RESET}"
}

print_banner() {
  echo -e "${BOLD}${CYAN}"
  echo "╔══════════════════════════════════════════════════════════════════╗"
  echo "║        SYNTHETIC PERFORMANCE USA — CLOUDFLARE DEPLOYMENT        ║"
  echo "║             Target: https://syntheticperformanceusa.com         ║"
  echo "╚══════════════════════════════════════════════════════════════════╝"
  echo -e "${RESET}"
}

# Default flags
DRY_RUN=false
SKIP_CHECK=false
SKIP_BUILD=false
DOMAIN="syntheticperformanceusa.com"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --skip-check)
      SKIP_CHECK=true
      shift
      ;;
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    -h|--help)
      echo "Usage: ./deploy.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --dry-run       Validate prerequisites, install, check, and build without deploying"
      echo "  --skip-check    Skip Astro TypeScript typechecking (pnpm run check)"
      echo "  --skip-build    Skip Astro build step if dist/ is already pre-built"
      echo "  -h, --help      Display this help message"
      echo ""
      echo "Environment Variables:"
      echo "  CLOUDFLARE_API_TOKEN    Cloudflare API Token with Workers & DNS permissions"
      echo "  CLOUDFLARE_ACCOUNT_ID   Target Cloudflare Account ID (optional if only 1 account)"
      exit 0
      ;;
    *)
      log_error "Unknown option: $1"
      echo "Run ./deploy.sh --help for usage information."
      exit 1
      ;;
  esac
done

# Ensure we run from the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "${SCRIPT_DIR}/../wrangler.toml" ]]; then
  PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
elif [[ -f "${SCRIPT_DIR}/wrangler.toml" ]]; then
  PROJECT_ROOT="${SCRIPT_DIR}"
else
  log_error "Could not locate project root containing wrangler.toml"
  exit 1
fi

cd "${PROJECT_ROOT}"

print_banner

# ------------------------------------------------------------------------------
# STEP 1: Verify System Prerequisites
# ------------------------------------------------------------------------------
log_step "1/6 Verifying System Prerequisites"

# 1.1 Node.js check
if ! command -v node >/dev/null 2>&1; then
  log_error "Node.js is not installed!"
  echo "Please install Node.js v20.0.0 or higher from https://nodejs.org/"
  exit 1
fi

NODE_VERSION="$(node -v | sed 's/^v//')"
NODE_MAJOR="$(echo "${NODE_VERSION}" | cut -d. -f1)"

if [[ "${NODE_MAJOR}" -lt 20 ]]; then
  log_error "Node.js version is ${NODE_VERSION}. Version >= 20.0.0 is required."
  exit 1
fi
log_success "Node.js version: v${NODE_VERSION} (Supported)"

# 1.2 pnpm check & auto-resolution
if ! command -v pnpm >/dev/null 2>&1; then
  log_warn "pnpm is not found in PATH. Attempting automatic installation..."
  if command -v corepack >/dev/null 2>&1; then
    log_info "Enabling corepack..."
    corepack enable || true
  fi

  if ! command -v pnpm >/dev/null 2>&1; then
    log_info "Installing pnpm globally via npm..."
    npm install -g pnpm
  fi

  if ! command -v pnpm >/dev/null 2>&1; then
    log_error "Could not install pnpm automatically. Please install pnpm manually: npm i -g pnpm"
    exit 1
  fi
fi

PNPM_VERSION="$(pnpm -v)"
log_success "pnpm version: v${PNPM_VERSION}"

# ------------------------------------------------------------------------------
# STEP 2: Install Dependencies
# ------------------------------------------------------------------------------
log_step "2/6 Installing Project Dependencies"
pnpm install
log_success "Dependencies installed."

# ------------------------------------------------------------------------------
# STEP 3: Pre-flight Domain & Nameserver Resolution Check
# ------------------------------------------------------------------------------
log_step "3/6 Pre-flight DNS & Nameserver Check"

NS_CHECK_PASSED=false
if command -v dig >/dev/null 2>&1; then
  CURRENT_NS="$(dig +short NS "${DOMAIN}" 2>/dev/null || true)"
elif command -v nslookup >/dev/null 2>&1; then
  CURRENT_NS="$(nslookup -type=ns "${DOMAIN}" 2>/dev/null || true)"
else
  CURRENT_NS=""
fi

if echo "${CURRENT_NS}" | grep -qi "cloudflare.com"; then
  log_success "${DOMAIN} nameservers are pointing to Cloudflare!"
  NS_CHECK_PASSED=true
else
  log_warn "${DOMAIN} does not appear to be pointing to Cloudflare nameservers yet."
  echo -e "   ${DIM}Current nameserver lookup returned:${RESET}"
  if [[ -n "${CURRENT_NS}" ]]; then
    echo -e "   ${DIM}${CURRENT_NS}${RESET}"
  else
    echo -e "   ${DIM}(No NS records resolved)${RESET}"
  fi
  echo ""
  echo -e "   ${YELLOW}Note:${RESET} You can still deploy the Worker now! Cloudflare will register the"
  echo -e "   Custom Domains and generate SSL, but traffic will only reach the site once"
  echo -e "   nameservers are updated at your registrar."
  echo -e "   📖 See ${BOLD}docs/DOMAIN_DNS_SETUP.md${RESET} for registrar instructions."
fi

# ------------------------------------------------------------------------------
# STEP 4: Cloudflare Authentication & Account Verification
# ------------------------------------------------------------------------------
log_step "4/6 Cloudflare Authentication"

# Check if non-interactive token is set
WHOAMI_OUTPUT="$(pnpm exec wrangler whoami 2>&1 || true)"

if [[ -n "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  log_info "Found CLOUDFLARE_API_TOKEN in environment. Verifying credentials..."
  if echo "${WHOAMI_OUTPUT}" | grep -q "You are not authenticated"; then
    log_error "The provided CLOUDFLARE_API_TOKEN failed authentication."
    log_error "Ensure it has 'Workers Scripts:Edit', 'Zone:Read', and 'DNS:Edit' permissions."
    exit 1
  else
    log_success "Authenticated successfully via CLOUDFLARE_API_TOKEN!"
  fi
else
  # Check if wrangler is already logged in locally
  log_info "Checking local Wrangler session..."
  if ! echo "${WHOAMI_OUTPUT}" | grep -q "You are not authenticated"; then
    log_success "Authenticated with active Cloudflare session."
  else
    if [[ "${DRY_RUN}" == "true" ]]; then
      log_warn "No active Cloudflare session detected. Proceeding anyway because --dry-run is active."
    else
      log_warn "No active Cloudflare session detected."
      if [ -t 0 ]; then
        echo -e "\n${BOLD}Choose an authentication method:${RESET}"
        echo "  1) Launch browser to log in via OAuth (wrangler login)"
        echo "  2) Paste a Cloudflare API Token"
        read -rp "Select option [1/2] (Default: 1): " AUTH_CHOICE
        AUTH_CHOICE="${AUTH_CHOICE:-1}"

        if [[ "${AUTH_CHOICE}" == "2" ]]; then
          read -rsp "Enter CLOUDFLARE_API_TOKEN: " USER_TOKEN
          echo ""
          export CLOUDFLARE_API_TOKEN="${USER_TOKEN}"
          if pnpm exec wrangler whoami >/dev/null 2>&1; then
            log_success "Authenticated successfully with provided token!"
          else
            log_error "Invalid Cloudflare API token provided."
            exit 1
          fi
        else
          log_info "Launching Cloudflare browser login..."
          pnpm exec wrangler login
        fi
      else
        log_error "Non-interactive environment detected without CLOUDFLARE_API_TOKEN."
        echo "Please set CLOUDFLARE_API_TOKEN before running this script in CI/CD or headless environments."
        exit 1
      fi
    fi
  fi
fi

# Print active account info if authenticated
pnpm exec wrangler whoami 2>/dev/null || true

# ------------------------------------------------------------------------------
# STEP 5: Quality Gates & Build
# ------------------------------------------------------------------------------
if [[ "${SKIP_CHECK}" != "true" ]]; then
  log_step "5a/6 Running Typecheck & Verification"
  pnpm run check
  log_success "Typecheck passed!"
else
  log_info "Skipping typecheck (--skip-check passed)"
fi

if [[ "${SKIP_BUILD}" != "true" ]]; then
  log_step "5b/6 Building Static Production Assets (Astro)"
  pnpm run build
  log_success "Production assets generated in dist/"
else
  log_info "Skipping build step (--skip-build passed)"
fi

# ------------------------------------------------------------------------------
# STEP 6: Deploy to Cloudflare Workers
# ------------------------------------------------------------------------------
log_step "6/6 Deploying to Cloudflare Workers"

if [[ "${DRY_RUN}" == "true" ]]; then
  log_warn "Dry-run mode active. Validating bundle with wrangler deploy --dry-run..."
  pnpm exec wrangler deploy --dry-run || log_warn "Wrangler dry-run requires Cloudflare API auth; local build succeeded."
  log_success "Dry-run completed successfully! No changes pushed to Cloudflare."
  exit 0
fi

log_info "Executing: pnpm exec wrangler deploy"
pnpm exec wrangler deploy

# ------------------------------------------------------------------------------
# Post-Deployment Summary & Next Steps
# ------------------------------------------------------------------------------
echo ""
echo -e "${BOLD}${GREEN}====================================================================${RESET}"
echo -e "${BOLD}${GREEN}               🎉 DEPLOYMENT COMPLETED SUCCESSFULLY                 ${RESET}"
echo -e "${BOLD}${GREEN}====================================================================${RESET}"
echo ""
echo -e "${BOLD}Website Endpoints:${RESET}"
echo -e "  • Apex:      ${CYAN}https://${DOMAIN}${RESET}"
echo -e "  • Subdomain: ${CYAN}https://www.${DOMAIN}${RESET}"
echo -e "  • Referral:  ${CYAN}https://${DOMAIN}/go/lookup${RESET}"
echo ""
echo -e "${BOLD}Post-Deployment Checklist:${RESET}"
if [[ "${NS_CHECK_PASSED}" != "true" ]]; then
  echo -e "  ${YELLOW}[ ] Update Registrar Nameservers${RESET}: Point ${DOMAIN} to Cloudflare's assigned nameservers."
fi
echo -e "  [ ] Verify SSL/TLS Mode: Set to ${BOLD}Full (strict)${RESET} in Cloudflare Dashboard &rarr; SSL/TLS."
echo -e "  [ ] Enable Always Use HTTPS: Cloudflare Dashboard &rarr; SSL/TLS &rarr; Edge Certificates."
echo -e "  [ ] Configure Email Routing: Set up free forwarding for brandon@${DOMAIN} (Dashboard &rarr; Email Routing)."
echo ""
echo -e "📖 Full DNS, SSL, and Email setup manual: ${BOLD}docs/DOMAIN_DNS_SETUP.md${RESET}"
echo ""
