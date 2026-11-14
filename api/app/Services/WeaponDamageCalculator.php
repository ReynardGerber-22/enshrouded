<?php

namespace App\Services;

class WeaponDamageCalculator
{
    public function calculate(
        ?int $itemLevel,
        ?float $damageSpeedMod,
        ?float $damageDmgMod
    ): ?int {
        if ($itemLevel === null || $damageSpeedMod === null || $damageDmgMod === null) {
            return null;
        }

        $baseDamage = (int) floor(10 + 1.5 * $itemLevel);

        return (int) floor($baseDamage * $damageSpeedMod * $damageDmgMod);
    }
}
