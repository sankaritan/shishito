"""
@author: Vojtech Burian
@summary: Selenium Webdriver Python test runner
"""

import os
import pytest


class ShishitoExecution(object):
    """ Base class for platform ControlExecution objects. """

    def __init__(self, shishito_support, test_timestamp):
        self.shishito_support = shishito_support

        environment_class = self.shishito_support.get_module('test_environment')
        self.environment = environment_class(shishito_support)

        self.result_folder = os.path.join(self.shishito_support.project_root, 'results', test_timestamp)

    def get_test_result_prefix(self, config_section):
        """ Create string prefix for test results.

        :param str config_section: section in platform/environment.properties config
        :return: str with test result prefix
        """

        return ''

    def run_tests(self):
        """ Trigger PyTest runner.
        Run PyTest for each browser/device combination, taken from .properties file for proper
        platform and environment.
        """

        test_status = 0

        for config_section in self.shishito_support.env_config.sections():
            print 'Running combination: ' + config_section
            tmp_test_status = self.trigger_pytest(config_section)
            if tmp_test_status != 0:
                test_status = tmp_test_status
        return test_status

    def trigger_pytest(self, config_section):
        """ Run PyTest runner on specific browser/device configuration. Function creates arguments for pytest.
        Function executes pytest.main() with created arguments.

        :param str config_section: section in platform/environment.properties config
        :return: result of pytest.main() function
        """

        test_result_prefix = self.get_test_result_prefix(config_section)

        junit_xml_path = os.path.join(self.result_folder, config_section + '.xml')
        html_path = os.path.join(self.result_folder, config_section + '.html')

        # prepare pytest arguments into execution list
        pytest_arguments_dict = {
            '--test_platform=': '--test_platform=' + self.shishito_support.test_platform,
            '--test_environment=': '--test_environment=' + self.shishito_support.test_environment,
            '--environment_configuration=': '--environment_configuration=' + config_section,
            '--junitxml=': '--junitxml=' + junit_xml_path,
            '--junit-prefix=': '--junit-prefix=' + test_result_prefix,
            '--html=': '--html=' + html_path,
            '--html-prefix=': '--html-prefix=' + test_result_prefix,
            '--instafail': '--instafail',
        }

        # extend pytest_arguments with environment specific args
        extra_pytest_arguments = self.environment.get_pytest_arguments(config_section)
        if extra_pytest_arguments:
            pytest_arguments_dict.update(extra_pytest_arguments)

        test_directory = self.shishito_support.get_opt('test_directory')
        if not test_directory:
            raise ValueError('Not test directory was specified.')

        pytest_arguments = [
            os.path.join(self.shishito_support.project_root, test_directory),
        ]

        pytest_arguments.extend(pytest_arguments_dict.values())

        # set pytest parallel execution argument
        parallel_tests = int(self.shishito_support.get_opt('parallel_tests'))
        if parallel_tests > 1:
            pytest_arguments.extend(['-n', str(parallel_tests)])

        # set pytest smoke test argument
        smoke = self.shishito_support.get_opt('smoke')
        if smoke:
            pytest_arguments.extend(['-m', 'smoke'])

        return pytest.main(pytest_arguments)
