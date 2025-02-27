# Interface: TargetConfiguration<T\>

Target's configuration

## Type parameters

| Name | Type  |
| :--- | :---- |
| `T`  | `any` |

## Table of contents

### Properties

- [command](../../devkit/documents/TargetConfiguration#command)
- [configurations](../../devkit/documents/TargetConfiguration#configurations)
- [defaultConfiguration](../../devkit/documents/TargetConfiguration#defaultconfiguration)
- [dependsOn](../../devkit/documents/TargetConfiguration#dependson)
- [executor](../../devkit/documents/TargetConfiguration#executor)
- [inputs](../../devkit/documents/TargetConfiguration#inputs)
- [options](../../devkit/documents/TargetConfiguration#options)
- [outputs](../../devkit/documents/TargetConfiguration#outputs)

## Properties

### command

• `Optional` **command**: `string`

Used as a shorthand for nx:run-commands, a command to run.

---

### configurations

• `Optional` **configurations**: `Object`

Sets of options

#### Index signature

▪ [config: `string`]: `any`

---

### defaultConfiguration

• `Optional` **defaultConfiguration**: `string`

A default named configuration to use when a target configuration is not provided.

---

### dependsOn

• `Optional` **dependsOn**: (`string` \| [`TargetDependencyConfig`](../../devkit/documents/TargetDependencyConfig))[]

This describes other targets that a target depends on.

---

### executor

• `Optional` **executor**: `string`

The executor/builder used to implement the target.

Example: '@nx/rollup:rollup'

---

### inputs

• `Optional` **inputs**: (`string` \| `InputDefinition`)[]

This describes filesets, runtime dependencies and other inputs that a target depends on.

---

### options

• `Optional` **options**: `T`

Target's options. They are passed in to the executor.

---

### outputs

• `Optional` **outputs**: `string`[]

List of the target's outputs. The outputs will be cached by the Nx computation
caching engine.
