<?php

namespace Tests\Unit;

use App\Services\WeaponDamageCalculator;
use PHPUnit\Framework\TestCase;

class WeaponDamageCalculatorTest extends TestCase
{
    public function test_it_calculates_base_damage_for_documented_levels(): void
    {
        $calculator = new WeaponDamageCalculator;

        foreach ([16 => 34, 21 => 41, 26 => 49, 36 => 64] as $level => $expected) {
            $this->assertSame(
                $expected,
                $calculator->calculate($level, 1.0, 1.0),
                "Unexpected estimate at item level {$level}."
            );
        }
    }

    public function test_it_applies_modifiers_after_flooring_base_damage(): void
    {
        $calculator = new WeaponDamageCalculator;

        $this->assertSame(51, $calculator->calculate(16, 1.0, 1.5));
        $this->assertSame(61, $calculator->calculate(21, 1.5, 1.0));
        $this->assertSame(41, $calculator->calculate(16, 1.1, 1.1));
    }

    public function test_it_returns_null_when_an_input_is_missing(): void
    {
        $calculator = new WeaponDamageCalculator;

        $this->assertNull($calculator->calculate(null, 1.0, 1.0));
        $this->assertNull($calculator->calculate(16, null, 1.0));
        $this->assertNull($calculator->calculate(16, 1.0, null));
    }
}
