# CHAMPION TOGETHER - Spec Driven Development & Test Driven Development Guide

## Project Summary

A decentralized fan club platform for fighters. Fans contribute USDC → DAO treasury → Smart contracts auto-distribute to fighter/gym/organizers. Members NFT minted per support, ranks unlock exclusive content via Lit Protocol. Victory bonuses incentivize engagement.

## General Guidelines
- Unless otherwise specified, think in English and output responses in clear, natural Japanese
- Always activate the project at the beginning of each session
- If the project is not onboarded, perform onboarding first
- Follow Test-Driven Development (TDD) and Spec-Driven Development (SDD) principles for design and implementation

## Repository Structure (Monorepo)

```
/
├── frontend/          # React web application
├── contracts/         # Sui Move smart contracts
└── lit-protocol/      # Lit Protocol integration
```

## Tech Stack

### Frontend (`/frontend`)
- **Framework**: Vite + React
- **Routing**: React Router v7
- **Styling**: radix-ui
- **Wallet**: Sui Wallet SDK
- **State**: React Context / hooks
- **Package Manager**: pnpm

### Smart Contracts (`/contracts`)
- **Language**: Move
- **Blockchain**: Sui
- **Package Manager**: Sui CLI

### Lit Protocol (`/lit-protocol`)
- **Purpose**: Decentralized access control for tiered content
- **Integration**: Lit SDK + Sui NFT verification

## Environment Variables

```bash
# frontend/.env
VITE_SUI_NETWORK=testnet
VITE_PACKAGE_ID=0x...
VITE_LIT_NETWORK=cayenne

# contracts/.env
SUI_NETWORK=testnet
DEPLOYER_ADDRESS=0x...
```

## Testing Strategy

### Smart Contracts
- Unit tests for each module
- Integration tests for cross-module interactions
- Test victory bonus distribution logic
- Test rank calculation edge cases

## Security Considerations

1. **Input Validation**: All Move functions validate inputs (amounts > 0, valid addresses)
2. **Access Control**: Only authorized addresses can trigger distributions
3. **Reentrancy**: Use Sui's resource model (no reentrancy by design)
4. **Integer Overflow**: Move has built-in overflow checks

## Design System

### Color Palette

| Usage | Color | Code |
|-------|-------|------|
| Primary Color | Electric Blue | `#0A84FF` |
| Secondary Color | Dark Slate | `#0B0E11` |
| Accent / Win / Urgent | Fighting Red | `#E53935` |
| Primary Text | White | `#FFFFFF` |
| Secondary Text | Cool Gray | `#C9D1D9` |
| Border | Subtle Dark Gray | `#2A2F34` |

### Styling Guidelines

- Use fighter-themed colors (bold, energetic)
- Mobile-first responsive design
- Custom theme defined in `frontend/src/theme.css`

## Core Development Philosophy
- Focus not only on writing working code, but always consider quality, maintainability, and security
- Strike the appropriate balance based on project stage (prototype, MVP, production)
- When you find a problem, don't ignore it—address it or explicitly document it
- Boy Scout Rule: Leave code better than you found it

## Error Handling Principles
- Resolve all errors, even those that seem loosely related
- Fix root causes rather than suppressing errors (@ts-ignore, swallowing with try-catch, etc.)
- Detect errors early and provide clear error messages
- Always cover error cases with tests
- Always consider the possibility of failure for external APIs and network communications

## Code Quality Standards
- DRY Principle: Avoid duplication and maintain a single source of truth
- Use meaningful variable and function names to clearly convey intent
- Maintain consistent coding style throughout the project
- Don't ignore small problems—fix them as soon as discovered (Broken Windows Theory)
- Comments should explain "why", code should express "what"

## Testing Discipline
- Don't skip tests—fix them if there are issues
- Test behavior, not implementation details
- Avoid dependencies between tests; they should run in any order
- Tests should be fast and always return the same results
- Coverage is a metric; prioritize high-quality tests

## Maintainability and Refactoring
- Consider improving existing code when adding features
- Break large changes into small steps
- Actively delete unused code
- Regularly update dependencies (for security and compatibility)
- Explicitly document technical debt in comments or documentation

## Security Mindset
- Manage API keys, passwords, etc. with environment variables (no hardcoding)
- Validate all external inputs
- Operate with minimum necessary privileges (Principle of Least Privilege)
- Avoid unnecessary dependencies
- Run security audit tools regularly

## Performance Awareness
- Optimize based on measurement, not speculation
- Consider scalability from the early stages
- Defer loading resources until needed
- Clearly define cache expiration and invalidation strategies
- Avoid N+1 problems and over-fetching

## Ensuring Reliability
- Set appropriate timeout handling
- Implement retry mechanisms (consider exponential backoff)
- Utilize circuit breaker patterns
- Build resilience against temporary failures
- Ensure observability with appropriate logs and metrics

## Understanding Project Context
- Balance business requirements with technical requirements
- Determine the truly necessary quality level for the current phase
- Maintain minimum quality standards even under time constraints
- Choose implementations appropriate for the team's technical level

## Recognizing Tradeoffs
- Perfection is impossible (there is no silver bullet)
- Find the optimal balance within constraints
- Prioritize simplicity for prototypes, robustness for production
- Clearly document compromises and their rationale

## Git Operations Basics
- Use Conventional Commit format (feat:, fix:, docs:, test:, refactor:, chore:)
- Commits should be atomic, focusing on a single change
- Write clear, descriptive commit messages in English
- Avoid direct commits to main/master branch

## Code Review Attitude
- Accept review comments as constructive improvement suggestions
- Focus on code, not individuals
- Clearly explain reasons for changes and their impact
- Welcome feedback as learning opportunities

## Debugging Best Practices
- Establish steps to reliably reproduce the problem
- Narrow down the problem scope with binary search
- Start investigation from recent changes
- Utilize appropriate tools like debuggers and profilers
- Document findings and solutions, share knowledge

## Dependency Management
- Add only truly necessary dependencies
- Always commit lock files like package-lock.json
- Check license, size, and maintenance status before adding new dependencies
- Update regularly for security patches and bug fixes

## Documentation Standards
- Clearly describe project overview, setup, and usage in README
- Keep documentation synchronized with code updates
- Prioritize showing examples
- Record important design decisions in ADR (Architecture Decision Records)

## Continuous Improvement
- Apply lessons learned to the next project
- Conduct regular retrospectives and improve processes
- Appropriately evaluate and adopt new tools and techniques
- Document knowledge for the team and future developers
